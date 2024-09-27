const handle_error =  (error) => {
if (error.response) {
        console.log(error.response.statusText);
        console.log(error.response.status);
        return [error.response.status, error.response.statusText]
    } else if (error.request) {
        console.log(error.message);
        return [503, "API Connection Error"]
    } else {
        console.log('Error', error.message);
        return [500, "Server Error"]
    }
}

export default handle_error;

