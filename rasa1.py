import requests

def get_rasa_response(user_input):
    url = "http://localhost:5005/webhooks/rest/webhook"  # Adjust the URL based on your Rasa server configuration
    payload = {"message": user_input}
    response = requests.post(url, json=payload)
    #print(response[0]['text'])
    
    if response.status_code == 200:
        return response.json()
    else:
        return None

def main():
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['exit', 'quit', 'bye']:
            print("Exiting the conversation.")
            break
        
        rasa_response = get_rasa_response(user_input)
        
        if rasa_response:
            print("Bot:", rasa_response[0]['text'])
        else:
            print("Error getting response from Rasa.")

def send_fastapi(input):
    rasa_response = get_rasa_response(input)  
    s=""
    for i in range(len(rasa_response)):
        s+=rasa_response[i]['text']
        s+="\n" 
    if rasa_response:
        return(s)
    else:
        return("Error getting response from Rasa.")
