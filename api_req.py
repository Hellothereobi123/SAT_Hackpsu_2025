from google import genai

client = genai.Client(api_key="AIzaSyBMSjV_Y7bmAq3DcDyG5S-B3Tcd5xcuMCE")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Explain how AI works in bullet points in less than 5 sentences.",
)

print(response.text)