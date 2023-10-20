from fastapi import FastAPI, UploadFile, File, HTTPException, Response
from pymongo import MongoClient
from gridfs import GridFS
from io import BytesIO
import os
from pathlib import Path


from starlette.responses import JSONResponse


from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import unquote


app = FastAPI(
    title="Legal AID",  
    description="Documentation for all APIs used in Legal AID app",
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
username = 'username'
password = 'pdfforms'
cluster_url = 'your_cluster_url'
database = 'PdfForms'

mongo_uri = f"mongodb+srv://{username}:{password}@pdfforms.pjqmkzp.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(mongo_uri)
db = client.get_database("PdfForms")
fs = GridFS(db)

tenant_forms_collection = GridFS(db, collection="tenant-forms")





# upload files from comoputer to cloud
@app.post("to_cloud")
def upload_pdf_to_cloud(folder_path: str):
   
    # Check wether the fodler exists or not
   if os.path.exists(folder_path) and os.path.isdir(folder_path):

    # List all files and directories in the specified folder
    contents = os.listdir(folder_path)

    with open(folder_path, 'rb') as pdf_file:
        for i in contents:
            # upload folder's content (Pdfs)  to the cloud
            file_id = tenant_forms_collection.put(pdf_file, filename=i)
    


# @app.get("get_file_names")
# def get_files_names(folder_path):

#     #Check if the folder exists
#     if os.path.exists(folder_path) and os.path.isdir(folder_path):
#         # List the contents of the folder
#         folder_contents = os.listdir(folder_path)

#         # You can filter the contents or process them as needed
#         for item in folder_contents:
#             # print(item)  # This will print the names of the items in the folder
#             pass
#     else:
#         print(f"The folder '{folder_path}' does not exist.")


# fetch the pdf form from cloud to be dislayed on the webpage.
@app.get("/get_form/{file_name}")
async def get_form(file_name: str):
    try:
        file_data = fs.find_one({"filename": file_name})
        if file_data is not None:
            pdf_content = file_data.read()
            # Return the PDF file as binary data
            return Response(content=pdf_content, media_type='application/pdf', headers={'Content-Disposition': f'inline; filename="{file_name}"'})
        else:
            raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# fetch existing files names and display them in the dropdown menu 
collection = db["fs.files"]
documents = collection.find({})
@app.get("/get_form_options")
def get_form_options():
    try:
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
    

filled_forms = db["filled_forms"]


@app.post("/save_pdf")
async def save_pdf(pdf_file: UploadFile):
    if pdf_file:
        content = await pdf_file.read()
        # Save the PDF to MongoDB
        result = collection.insert_one({"file_data": content})
        return JSONResponse(content={"message": "PDF uploaded successfully", "object_id": str(result.inserted_id)})
    else:
        return JSONResponse(content={"error": "No PDF file provided"}, status_code=400)
    

# TODO: finishing and testing the save to cloud api

@app.post("/save_to_cloud/{form_name}")
async def save_pdf_to_cloud(form_name: str, pdf_file: UploadFile):
    # Ensure the form_name is a valid identifier (e.g., no special characters)
    if not form_name.isalnum():
        raise HTTPException(status_code=400, detail="Invalid form name")

    try:
        # Read the file content
        pdf_content = await pdf_file.read()

        # Save the file content to MongoDB
        document = {
            "form_name": form_name,
            "pdf_content": pdf_content
        }
        inserted_id = tenant_forms_collection.insert_one(document).inserted_id

        return {"message": f"PDF saved to MongoDB with ID: {inserted_id}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save PDF: {str(e)}")