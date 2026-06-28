const fs = require("fs");

// fs.writeFileSync("./test.txt", "Hey there");

// fs.writeFile("./test.txt", "Async", (err) => {
//   if (err) {
//     console.log("Error Occur:", err);
//   } else {
//     console.log("File written successfully");
//   }
// });



// const results = fs.readFileSync('./contacts.txt' , "utf-8");
// console.log(results)


// fs.readFile("./contacts.txt" , "utf-8", (err , result) =>{
//     if(err){
//         console.log("Error" , err)
//     }
//     else{
//         console.log(result)
//     }
// })


// fs.appendFileSync("./test.txt"  , new Date().getDate().toLocaleString());
// fs.appendFileSync("./test.txt"  , `${Date.now()} Hey There \n`);

// fs.cpSync("./test.txt" , "./copy.txt")


// fs.unlinkSync("./copy.txt")


console.log(fs.statSync("./test.txt"))

fs.mkdirSync("Directory Name")