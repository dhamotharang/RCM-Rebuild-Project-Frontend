export function getAlertMessage(form) {
    let msg = 'Kindly complete the form.';
    let invalidForm = false;

    Object.keys(form.controls).forEach(key => {
        if (form.controls[key].errors !== null 
            && form.controls[key].status === 'INVALID' 
                && form.controls[key].touched === true) {
                invalidForm = true;
        }
    });

    if (invalidForm) {
        msg = 'Kindly check for invalid inputs.';
    }

    return msg;
}