module.exports = {
    validateName: (s) => {
        var strength = 0;
        if (s.indexOf(' ') >= 0) {
            strength += 1;
        } else {
            console.log(("Musr contain space!"));
        }

        if (s.match(/[0-9]+/)) {
            console.log(("Name cant contain numbers!"));
        } else {
            strength += 1;
        }

        if (strength == 2) {
            return true
        } else {
            return false
        }
    },

    validatePswd: (password) => {
        var strength = 0;
        if (password.match(/[a-z]+/)) {
            strength += 1;
        } else {
            console.log(("Mising lowcase english letter!"));
        }
        if (password.match(/[A-Z]+/)) {
            strength += 1;
        } else {
            console.log(("Mising capital english letter!"));
        }
        if (password.match(/[0-9]+/)) {
            strength += 1;
        } else {
            console.log(("Mising a number!"));
        }
        if (password.match(/[!@#$%&*]+/)) {
            strength += 1;
        } else {
            console.log(("Mising a symbole (!@#$%&*)"));
        }
        if (password.length >= 6) {
            strength += 1;
        } else {
            console.log(("Password too short!"));
        }
        if (password.length <= 12) {
            strength += 1;
        } else {
            console.log(("Password too long!"));
        }

        if (strength == 6) {
            return true
        } else {
            return false
        }
    },

    validateUsername: (username) => {
        var strength = 0;
        if (username.length >= 6) {
            strength += 1;
        } else {
            console.log(("username too short!"));
        }
        if (username.length <= 12) {
            strength += 1;
        } else {
            console.log(("username too long!"));
        }
        if (username.match(/[!@#$%&*]+/)) {
            strength -= 1;
        }

        console.log(strength);
        if (strength === 2) {
            return true
        } else {
            return false
        }
    },

    validatePhone: (phone) => {
        var strength = 0;
        if (phone.length > 10) {
            console.log(("Phone too long!"));
        } else if (phone.length < 10) {
            console.log(("Phone too short!"));
        } else {
            strength += 1;
        }
        if (isNaN(phone)) {
            console.log(("All Variable must be numbers!"));
        } else {
            strength += 1;
        }
        if (strength == 2) {
            return true
        } else {
            return false
        }


    },

    validateId: (id) => {
        var id = String(id).trim();
        if (id.length > 9 || id.length < 5 || isNaN(id)) return false;

        // Pad string with zeros up to 9 digits
        id = id.length < 9 ? ("00000000" + id).slice(-9) : id;

        return Array
            .from(id, Number)
            .reduce((counter, digit, i) => {
                const step = digit * ((i % 2) + 1);
                return counter + (step > 9 ? step - 9 : step);
            }) % 10 === 0;
    },

    validateEmail: (emailAdress) => {
        let regexEmail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
        if (emailAdress.match(regexEmail)) {
            return true;
        } else {
            return false;
        }
    },

    validateClassnum: (classnum) => {
        if (classnum >= 1 && classnum <= 12) {
            return true
        } else {
            return false
        }
    },


    validateGender: (gender) => {
        if (gender == "F" || gender == "M") {
            return true
        } else {
            return false
        }
    },

    validateStudentCode: (code) => {
        var streangth = 0;
        if (code.length == 6) {
            streangth += 1;
        } else {
            console.log(("must be 6 per long!"));

        }
        if (isNaN(code)) {
            console.log(("All Variable must be numbers!"));
        } else {
            streangth += 1;
        }

        if (streangth == 2) {
            return true
        } else {
            return false
        }
    },

    validateDate: (y, m, d) => {
        var ndate = new Date(y, m - 1, d);
        var con_date =
            "" + ndate.getFullYear() + (ndate.getMonth() + 1) + ndate.getDate(); //converting the date
        var gdate = "" + y + m + d; //given date
        return (gdate == con_date); //return true if date is valid
    },

    validateHour: (hh, mm) => {
        var streangth = 0;

        if (hh >= 0) {
            streangth += 1;
        }
        if (hh <= 24) {
            streangth += 1;
        }
        if (mm >= 0) {
            streangth += 1;
        }
        if (mm <= 59) {
            streangth += 1;
        }
        if (streangth == 4) {
            return true
        } else {
            return false
        }
    },
    validateRate: (rate) => {
        if (rate >= 0 && rate <= 5) {
            return true
        } else {
            return false
        }
    },

    testData: (value, inputType) => {
        return 0;
        switch (inputType) {
            case 1: // name
            {
                if (!(tests.validateName(value)))
                    return 1;
            }
            case 2: // pswd
            {
                if (!(tests.validatePswd(value)))
                    return 2;
                break;
            }
            case 3: // username
            {
                if (!(tests.validateUsername(value)))
                    return 3;
                break;
            }
            case 4: //phone
            {
                if (!(tests.validatePhone(value)))
                    return 4;
                break;
            }
            case 5: // id
            {
                if (!(tests.validateId(value)))
                    return 5;
                break;
            }
            case 6: // email
            {
                if (!(tests.validateEmail(value)))
                    return 6;
                break;
            }
            case 7: //
            {
                // check here
            }
        }
        return 0;
    }
}