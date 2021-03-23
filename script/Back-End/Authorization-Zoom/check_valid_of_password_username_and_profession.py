def password_check(password):
    # passwords = password_crack(i) for i in passwords_data_base
    password_len = False
    is_one_capital = False
    is_one_special = False
    is_one_number = False
    """
    if password in passwords:
        return False
    """
    if len(password) >= 8:
        password_len = True
    for i in password:
        if not is_one_capital:
            if i.isupper():
                is_one_capital = True
        if not is_one_special:
            if not i in "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890":
                is_one_special = True     
        if not is_one_number:
            if i.isnumeric():
                is_one_number = True
        if is_one_capital and is_one_number and is_one_special and password_len:
            return True
    if not password_len:
        return "password to short"
    if not is_one_capital:
        return "you need at least one capital letter"
    if not is_one_special:
        return "you need at least one special character"
    if not is_one_number:
        return "you need at least one number"    

print(password_check("Aa123456%"))

def user_check(user):
    # users = i for i in users_data_base
    """
    if user in users:
        return False
    """
    for i in user:
        if not i in "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz":
            return False
    return True

print(user_check("ariel"))

def subject_check(grade, subject):
    if grade >= 10 and grade >= 12:
        return "Teacher"
    elif grade < 10:
        return "Student"
    else:
        return "Too Old"
    pass
