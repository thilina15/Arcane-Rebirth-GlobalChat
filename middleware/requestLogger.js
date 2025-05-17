const requestLogger = (req, res, next) => {
    // Log request method and URL
    console.log('\n=== Incoming Request ===');
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Log request headers
    console.log('\nHeaders:');
    console.log(JSON.stringify(req.headers, null, 2));
    
    // Log request body if it exists
    if (Object.keys(req.body).length > 0) {
        console.log('\nBody:');
        console.log(JSON.stringify(req.body, null, 2));
    }
    
    // Log query parameters if they exist
    if (Object.keys(req.query).length > 0) {
        console.log('\nQuery Parameters:');
        console.log(JSON.stringify(req.query, null, 2));
    }
    
    // Log URL parameters if they exist
    if (Object.keys(req.params).length > 0) {
        console.log('\nURL Parameters:');
        console.log(JSON.stringify(req.params, null, 2));
    }
    
    console.log('\n=====================\n');
    
    next();
};

module.exports = requestLogger; 