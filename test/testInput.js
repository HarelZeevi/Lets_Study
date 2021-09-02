exports.hasWhiteSpace = (s) =>{
        var strength = 0;
        if (s.indexOf(' ') >= 0){
            strength += 1;
        }
        else{
           console.log("Must contain space!");
        }
    
        if (s.match('/[0-9]+/')) {
            console.log("Name cant contain numbers!");
        }
        else{
            strength += 1;
        }
        
        if(strength === 2){
            return true;
        }
        else{
            return false;
        }
}
