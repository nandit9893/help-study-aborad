Front End Folder Structure

src                          
├─ app                       
│  ├─ dashboard              
│  │  ├─ layout.jsx          
│  │  └─ page.jsx            
│  ├─ favicon.ico            
│  ├─ globals.css            
│  ├─ layout.js              
│  └─ page.js                
├─ Components                
│  ├─ Header.jsx             
│  └─ PreviousOperation.jsx  
├─ Redux                     
│  ├─ User                   
│  │  └─ UserSlice.js        
│  └─ Store.js               
├─ Utils                     
│  ├─ API.js                 
│  └─ Helper.js              
├─ favicon.ico               
└─ ReduxProvider.js          



Backend End Folder Structure

src                                    
├─ configure                           
│  └─ database.js                      
├─ controllers                         
│  ├─ auth.controllers.js              
│  ├─ task.controllers.js              
│  └─ website.controllers.js           
├─ middlewares                         
│  └─ auth.middlewares.js              
├─ models                              
│  ├─ task.models.js                   
│  ├─ users.models.js                  
│  └─ website.models.js                
├─ routes                              
│  ├─ auth.routes.js                   
│  ├─ task.routes.js                   
│  └─ website.routes.js                
├─ utils                               
│  ├─ nodemailer                       
│  │  └─ user.signup.nodemailer.js     
│  ├─ templates                        
│  │  └─ user.signup.template.js       
│  ├─ generate.acees.refresh.token.js  
│  ├─ generate.otp.js                  
│  └─ generate.slug.js                 
├─ app.js                              
├─ constants.js                        
└─ index.js                            
