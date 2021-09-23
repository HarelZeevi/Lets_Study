module.exports = {
    hasWhiteSpace: function (s){
        var strength = 0;
        if (s.indexOf(' ') >= 0) {
            strength += 1;
        } else {
            console.log("Must contain space!");
        }

        if (s.match('/[0-9]+/')) {
            console.log("Name cant contain numbers!");
        } else {
            strength += 1;
        }

        if (strength === 2) {
            return true;
        } else {
            return false;
        }
    },

    passwordcheck: function (password) {
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

    username: function(username) {
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


        if (strength == 2) {
            return true
        } else {
            return false
        }
    },

    phonenum: function(phone) {
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

    isValidIsraeliID: function(id) {
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

    // Usage
    /*
    ["339677395"].map(function(e) {
        console.log(e + " is " + (isValidIsraeliID(e) ? "a valid" : "an invalid") + " Israeli ID");
    });
    */

    validateEmail: function(emailAdress) {
        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (emailAdress.match(regexEmail)) {
            return true;
        } else {
            return false;
        }
    },

    validateEmail: function(emailAdress) {
        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (emailAdress.match(regexEmail)) {
            return true;
        } else {
            return false;
        }
    }
}