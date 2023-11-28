import os

def print_folder_contents(folder_path):
    try:
        # List the contents of the folder
        files_in_folder = os.listdir(folder_path)

        # Print the names of the files in the folder
        print("Files in the folder:")
        for file in files_in_folder:
            print(file)

    except Exception as e:
        print(f"An error occurred: {str(e)}")

# Replace '/path/to/your/folder' with the actual path to your folder
folder_path = '/Users/seddik/desktop/lbt/Landlord'
print_folder_contents(folder_path)
