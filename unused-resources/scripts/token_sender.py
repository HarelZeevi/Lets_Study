from uuid import uuid4
from itsdangerous import TimestampSigner
import smtplib
import ssl
import time

timestemp = TimestampSigner('secret-key')
TOKEN = timestemp.loads(str(uuid4()))
timestemp.unsign(TOKEN, max_age=5)
smtp_server = "smtp.gmail.com"
port = 587  # For starttls
sender_email = "harelzeevi@gmail.com"
receiver_email = "harelzeevi@gmail.com"
password = "abanibicybermahshevim5"
message = f"""\
Subject: Lets-Study Password Recovering Token

:Token for password recovering\n\n{TOKEN}"""

# Create a secure SSL context
context = ssl.create_default_context()

# Try to log in to server and send email
try:
    server = smtplib.SMTP(smtp_server, port)
    server.ehlo()  # Can be omitted
    server.starttls(context=context)  # Secure the connection
    server.ehlo()  # Can be omitted
    server.login(sender_email, password)
    server.sendmail(sender_email, receiver_email, message)
except Exception as e:
    # Print any error messages to stdout
    print(e)
finally:
    server.quit()


time.sleep(5)
print(TOKEN)
