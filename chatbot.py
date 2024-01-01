from fastapi import FastAPI, Request, HTTPException, Form,UploadFile,File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse,JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import pymongo
from spellchecker import SpellChecker
from datetime import datetime
import ml
from pathlib import Path
import speech_recognition as sr
from pydub import AudioSegment
import uuid
from translate import Translator
import rasa1
import langdetect1
import algo
import imageconvert
import os
import requests

#rasa run -m models --enable-api --cors "*" --debug
#rasa run actions --debug
#ngrok http 3000
#node index.js

from googletrans import Translator

def english_to_lang(text,lang):
    translator = Translator()
    translation = translator.translate(text, src='en', dest=lang)
    return translation.text

def translate_lang_to_english(text,lang):
    translator = Translator()
    translation = translator.translate(text, src=lang, dest='en')
    return translation.text


def convert_to_wav(input_file, output_file):
    audio = AudioSegment.from_file(input_file)
    print(audio)
    audio.export(output_file, format="wav")

app = FastAPI()
myclient = pymongo.MongoClient("mongodb+srv://Minebot:chatbot1234@chatbot.yes8jb1.mongodb.net/")
mydb = myclient["chatbots"]
users = mydb["users"]
mycol = mydb["documents"]
history = mydb["history"]
pay=mydb["payment-details"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to the origins you want to allow
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

user=None
subscribe=0
language="en"

TELEGRAM_BOT_TOKEN = "6685735454:AAGiL8CJqQYaTBpIPQHs--fcYPNQda79gBY"

class TextRequest(BaseModel):
    text: str

class Language(BaseModel):
    lang:str

class UserData1(BaseModel):
    username: str
    email: str
    password: str
class UserData2(BaseModel):
    username: str
    password: str
class Message(BaseModel):
    message: str

class payment(BaseModel):
    name: str
    email:str
    address:str
    city:str
    state:str
    zipcode:int
    cardname:str
    cardnumber:int
    expmonth:int
    expyear:int
    CVV:int

def sendmongo(data):
    finding=users.find_one({"username":data["username"]})
    print(finding)
    if finding!=None:
        return 0
    else:
        users.insert_one(data)
        return 1

def receivemongo(uname, pas):
    data=users.find_one({"email":uname})
    if data is None:
        return 0
    else:
        data=users.find_one({"$and": [{"email": uname}, {"password": pas}]})
        if data is None:
            return -1
        else:
            return 1

data=[]
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
@app.get("/login&signup", response_class=HTMLResponse)
async def signup_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/signup/")
async def signup(user_data: UserData1):
    global user
    data=user_data.dict()
    data["subscribed"]=0
    print(user_data.dict())
    res=sendmongo(data)
    print(res)

    if res==1:
        user = user_data.username
        return {"message": "User registered successfully"}
    else:
        return {"Message":"User is already Registered.Try to Log in"}

@app.post("/login/")
async def login(user_data: UserData2):
    global user  # Declare user as a global variable

    bol = receivemongo(user_data.username, user_data.password)
    if bol == 1:
        user = user_data.username  # Assign the value to the global variable
        return {"message": "Login Successful"}
    elif bol == -1:
        return {"message": "Invalid username or password"}
    else:
        return {"message": "User Not registered"}


@app.post("/process_text")
def process_text(text_request: TextRequest):
    input_text = text_request.text
    print(input_text)
    # Do something with the input text
    processed_text = english_to_lang(input_text,language)
    return {"processed_text": processed_text}

#language selection
@app.post("/lang-selection/")
def process_text(lang_request: Language):
    global language
    language = lang_request.lang
    print(language)
    # Do something with the input text
    processed_text = "Selected language is "+language
    return {"selected_lang": processed_text}



'''cursor=history.find({"user":user}).sort("timestamp",1)
for i in cursor:
    print(i+"hel")
for document in cursor:
    # Extract relevant fields from the document  # Assuming "_id" is one of the fields
    field1 = document["user_input"]
    field2 = document["bot_output"]
    # Add the extracted data to the dictionary using the document_id as the key
    data.append( {
        "user_input": field1,
        "bot_output": field2,
        # Add more fields as needed
    })'''

def clear():
    history.delete_many({"user":user})

print(DeprecationWarning)

# Define pairs of patterns and responses using regular strings


spell_checker = SpellChecker()

def spell_check(user_input):
    # Perform spelling correction
    corrected_input = []
    for word in user_input.split():
        corrected_word = spell_checker.correction(word)
        corrected_input.append(corrected_word)
    corrected_input = " ".join(corrected_input)
    
    # Get a response from the chatbot
    return corrected_input
# Function to get a response from the chatb



'''@app.get("/", response_class=HTMLResponse)
async def signup_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})'''

@app.get("/", response_class=HTMLResponse)
async def read_form(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request})

@app.post("/")
async def senddata():
    if(user==None):
        return {"message":0}
    else:
        USER=users.find_one({"email":user},{"_id":0,"username":1})
        print(USER)
        return {"message":1,"username":USER['username']}

@app.get("/subscribe", response_class=HTMLResponse)
async def read_form(request: Request):
    return templates.TemplateResponse("subscription.html", {"request": request})

@app.get("/payment", response_class=HTMLResponse)
async def read_form(request: Request):
    return templates.TemplateResponse("pay.html", {"request": request})

@app.post("/payment")
async def receivedata(user_data:payment):
    print(user_data.dict())
    if (user==None):
        return {"message":0}
    else:
        user_data["user_email"]=user
        user_data["subscription"]=subscribe
        result=pay.insert_one(user_data)
        print(result)
        return {"message":1}
    

app.mount("/chatbot/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

UPLOAD_FOLDER = Path("uploads")
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Save the uploaded file in the "uploads" folder
        file_path = UPLOAD_FOLDER / file.filename
        with file_path.open("wb") as f:
            f.write(file.file.read())
        print(file.filename)

        def is_file_in_directory(directory, filename):
            filepath = os.path.join(directory, filename)
            return os.path.isfile(filepath)

# Example usage
        directory_path = "c://Users//S. YATHISSH//OneDrive//Desktop//SIH 2023//CHATBOT//uploads"
        file_name = file.filename

        if is_file_in_directory(directory_path, file_name):
            print(f"The file {file_name} is in the directory {directory_path}")
        else:
            print(f"The file {file_name} is not in the directory {directory_path}")

        translated=(imageconvert.perform_ocr("C://Users//S. YATHISSH//OneDrive//Desktop//SIH 2023//CHATBOT//uploads//" +str(file.filename)))
        
        return {"response":translated}
    except Exception as e:
        return JSONResponse(content={"message": f"Error uploading file: {str(e)}"}, status_code=500)

@app.get("/chatbot/", response_class=HTMLResponse)
async def chat_get(request: Request):
    return templates.TemplateResponse("chat.html", {"request": request})

count=0
@app.post("/chat/")
async def chat(user_input: str = Form(...)):
    real_input=user_input
    #print(response)
    #print(user)
    global count
    
    if langdetect1.detect_language(user_input)!='en':
        user_input=translate_lang_to_english(user_input,language)
        response = rasa1.send_fastapi(user_input)
        buttons=algo.buttons(response)
        buttons[1]=english_to_lang(buttons[1],language)
        history.insert_one({"user":user,"user_input":real_input,"bot_output":buttons[1],"timestamp":datetime.now()})
        
        if buttons[0]==False:
            return {"response":buttons[1],"buttons":False}
        else:
            print(buttons[0])
            print("Hello World")
            for i in range(len(buttons[0])):
                buttons[0][i]=english_to_lang(buttons[0][i],language)
            return {"response":buttons[1],"buttons":buttons[0]}
        
    else:
        response = rasa1.send_fastapi(user_input)
        buttons=algo.buttons(response)
        history.insert_one({"user":user,"user_input":user_input,"bot_output":buttons[1],"timestamp":datetime.now()})
        #print(buttons)
        if buttons[0]==False:
            return {"response":buttons[1],"buttons":False}
        else:
            #buttons[0]=english_to_lang(buttons[0],language)
            
            return {"response":buttons[1],"buttons":buttons[0]}



@app.post("/subscription/")
async def subscribe(user_selection:str=Form(...)):
    print(user_selection)
    if user!=None:
        global subscribe
        subscribe=user_selection
        return {"message":user_selection}
    else:
        return {"message":0}

@app.post("/chat1/")
async def chat(user_input: str = Form(...)):
    if not user_input:
        raise HTTPException(status_code=422, detail="Data cannot be empty")
    response = (user_input)
    print(response)
    return {"response": response}



'''@app.post("/signup/")
async def signup(user_data: UserData1):
    print(user_data.dict())
    sendmongo(user_data.dict())
    return {"message": "User registered successfully"}

@app.post("/login/")
async def login(user_data: UserData2):
    print(user_data.dict())
    bol = receivemongo(user_data.username, user_data.password)
    if bol == 1:
        return {"message":"Login Successful"}
    elif bol==-1:
        return {"message": "Invalid username or password"}
    else:
        return {"message":"User Not registered"}'''
@app.get("/complaint", response_class="HTMLResponse")
async def signup_form(request: Request):
    return templates.TemplateResponse("complaint.html", {"request": request})

app.mount("/history/static", StaticFiles(directory="static"), name="static")

@app.get("/history/", response_class=HTMLResponse)
async def read_form(request: Request):
    return templates.TemplateResponse("his.html", {"request": request})

# Create a route to handle chatbot communication
@app.post("/hist/")
async def chat(messag: Message):
    #global user  # Ensure user is declared as a global variable
    print(user)
    if user!=None:
        cursor=history.find({"user":user}).sort("timestamp",1)
        data=[]
        for document in cursor:
        # Extract relevant fields from the document  # Assuming "_id" is one of the fields
            field1 = document["user_input"]
            field2 = document["bot_output"]
        # Add the extracted data to the dictionary using the document_id as the key
            data.append( {
                "user_input": field1,
                "bot_output": field2,
            # Add more fields as needed
            })
        msg = messag.dict()
        print(msg)
        if msg["message"].isdigit():
            print("Clear")
            history.delete_many({"user": user})
            return {"response":0}
        else:
            return JSONResponse(content=data)
    else:
        return {"response":-1}