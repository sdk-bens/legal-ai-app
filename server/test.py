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

file_path = '/Users/seddik/desktop/LBT/tenant'

tenant_forms_collection = "tenant-forms"



def upload_files_in_folder(folder_path, db, collection_name):
    fs = GridFS(db, collection=collection_name)
    
    for root, dirs, files in os.walk(folder_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            
            with open(file_path, 'rb') as file:
                file_id = fs.put(file, filename=file_name)
                print(f'Uploaded: {file_name} (ID: {file_id})')


upload_files_in_folder(file_path, db, tenant_forms_collection)