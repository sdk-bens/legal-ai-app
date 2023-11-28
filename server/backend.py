from fastapi import FastAPI, UploadFile, File, HTTPException, Response
from pymongo import MongoClient
from gridfs import GridFS
from io import BytesIO
import os
from pathlib import Path
from fastapi import Depends





from starlette.responses import JSONResponse


from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import unquote


app = FastAPI(
    title="Legal AID",  
    description="Documentation for all forms related APIs used in Legal AID app",
    version="1.0.0",
)

# Adding security to the API
app.add_middleware(
    CORSMiddleware,
    # Specify the origin of your React app
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection details
username = 'seddik'
password = 'benaissa'
cluster = 'cluster0'
forms_database = 'PdfForms'
users_database = 'users_data'



mongo_uri = f"mongodb+srv://{username}:{password}@{cluster}.d6evyg2.mongodb.net/?retryWrites=true&w=majority"


client = MongoClient(mongo_uri)
db = client.get_database(forms_database)
users_db = client.get_database(users_database)


# Create a GridFS instance for tenant forms in the selected database
tenantForms = GridFS(db, collection="tenantForms")

# Create a GridFS instance for landlord forms in the selected database
landlordForms = GridFS(db, collection="landlordForms")

fs = GridFS(db)


@app.post("/upload_forms_to_cloud")
def upload(folder_path: str, category: str):
    try:
        if category.lower() not in ('tenant', 'landlord'):
            return JSONResponse(content={"message": "Category must be 'tenant' or 'landlord'"}, status_code=400)

        if not os.path.exists(folder_path):
            return JSONResponse(content={"message": f"Folder '{folder_path}' does not exist"}, status_code=400)

        # Determine the GridFS collection based on the category
        if category.lower() == "tenant":
            gridfs_collection = GridFS(db, collection="tenantForms")
        else:
            gridfs_collection = GridFS(db, collection="landlordForms")

        # Upload new files
        uploaded_files = []

        for root, _, files in os.walk(folder_path):
            for file_name in files:
                file_path = os.path.join(root, file_name)

                # Check if the file already exists in the collection
                if gridfs_collection.find_one({"filename": file_name}):
                    continue  # Skip uploading existing files

                # Open the file in binary mode
                with open(file_path, 'rb') as file:
                    # Read the binary data
                    file_data = file.read()

                # Store the binary data in MongoDB using GridFS
                file_id = gridfs_collection.put(file_data, filename=file_name)
                uploaded_files.append((file_name, str(file_id)))

        return JSONResponse(content={"message": "Files uploaded to MongoDB", "uploaded_files": uploaded_files}, status_code=200)

    except Exception as e:
        return JSONResponse(content={"message": f"An error occurred: {str(e)}"}, status_code=500)


def get_form(collection, file_name):
    try:
        file_data = collection.find_one({"filename": file_name})
        if file_data is not None:
            pdf_content = file_data.read()
            # Return the PDF file as binary data
            return Response(content=pdf_content, media_type='application/pdf', headers={'Content-Disposition': f'inline; filename="{file_name}"'})
        else:
            raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_landlord_form/{file_name}")
async def get_landlord_form(file_name: str):
    return get_form(landlordForms, file_name)

@app.get("/get_tenant_form/{file_name}")
async def get_tenant_form(file_name: str):
    return get_form(tenantForms, file_name)


# Fetch existing files names and display them in the dropdown menu 
@app.get("/get_form_options")
def get_form_options(category: str):
    

    if category.lower() not in ('tenant', 'landlord'):
        return {"message": "Category must be 'tenant' or 'landlord"}
    elif category.lower() == "tenant":
        collection = db["tenantForms.files"]
    elif category.lower() == "landlord":
        collection = db["landlordForms.files"]

    try:
        documents = collection.find({})
        file_names = []
        for document in documents:
            file_name = document.get("filename")
            if file_name:
                forms = file_name.split('.')[0]
                file_names.append(forms)
        return file_names
    except Exception as e:
        # Log the error for debugging
        print(f"Error in get_form_options: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    



@app.post("/submit-form/{user_email}/{formToFill}")
async def submit_form(user_email: str, formToFill: str, responses: dict, db=Depends(lambda: db)):
    try:
        # Use user_email as the collection name
        user_collection = users_db[user_email]

        result = user_collection.insert_one({**responses, "form_name": formToFill})

        return {"message": "Data submitted successfully", "id": str(result.inserted_id)}
    except Exception as e:
        print("Error:", e)  
        raise HTTPException(status_code=500, detail=f"Error submitting data: {str(e)}")

