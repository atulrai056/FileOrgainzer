#!/usr/bin/env node
let inputArr = process.argv.slice(2);
const { Console } = require("console");
let fs = require("fs");
let path = require("path");
//console.log(inputArr);
// node main.js tree "Directory path"
// node main.js orgainze "Directory path"
// node main.js help 

let command = inputArr[0];
let types = {
    media: ["mp4","mkv","png"],
    archives:["zip","7z","rar","tar","gz","ar","iso","xz"],
    documents :["docx","doc","pdf",'xlsx','xls','odt','odp','odg','txt','ps','tex'],
    app:['exe','dmg','pkg','deb']
}

switch(command){
      case "tree":
        treeFn(inputArr[1]);
        break;
      case "orgainze":
        orgainzeFn(inputArr[1]);
        break;
      case "help":
          helpFn();
        break;
      default:
          console.log("Please 👏 Input Right command ");
          break;
        
}

function treeFn(dirPath){
   // console.log("tree command implimented for",dirPath);
   //let destPath;
    if(dirPath==undefined){
       // console.log("Kindly enter the path");local declartion 
        treeHelper(process.cwd(),"");
        return;
    }
    else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
           treeHelper(dirPath,"");
        }
        else{
            console.log("Kindly enetr the correct path");
            return;
        }
    }

}
function treeHelper(dirPath, indent){
    // is file or folder 
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile == true ){
        let fileName = path.basename(dirPath);
        console.log(indent + "├──"+ fileName);
    }
    else{
        let dirName = path.basename(dirPath);
        console.log(indent + "└──"+ dirName);
        let childrens = fs.readdirSync(dirPath);
        for(let i=0; i<childrens.length;i++){
            let childPath = path.join(dirPath,childrens[i]);
            treeHelper(childPath,indent + "\t");
        }
    }
}
function orgainzeFn(dirPath){

    //console.log("orgainze command implimented for",dirPath);
    let destPath;
    if(dirPath==undefined){
        //console.log("Kindly enter the path");
        destPath= process.cwd();// global declartion 
        return;
    }
    else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
           
            destPath = path.join(dirPath,"orgainze_files");
           if(fs.existsSync(destPath)==false){
               fs.mkdirSync(destPath);       
           }
        }
        else{
            console.log("Kindly enetr the correct path");
            return;
        }
    }
     orgainzeHelper(dirPath,destPath);
}
function orgainzeHelper(src, dest){
    let chlidNames = fs.readdirSync(src);
    //console.log(chlidNames);
    for(let i=0; i<chlidNames.length;i++){
        let childAddress = path.join(src,chlidNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            //console.log(chlidNames[i]);
            let category =getCategory(chlidNames[i]);
            console.log(chlidNames[i],"belongs to this",category);
            sendFiles(childAddress,dest,category);
        }
    }
}
 function sendFiles(srcFilePath,dest,category){
    let categoryPath = path.join(dest, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    //fs.unlinkSync(srcFilePath);
    console.log(fileName, "copied to ", category);
 }
 function getCategory(names){
    let ext = path.extname(names);
     ext = ext.slice(1);
     for(let type in types){
         let cTypearray= types[type];
         for(let i=0; i<cTypearray.length;i++){
             if(ext==cTypearray[i]){
                 return type;
             }
         }
     }
     return "others";
 }
function helpFn(dirPath){
    console.log(`
    List of commands :
     node main.js tree "Directory path"
     node main.js orgainze "Directory path"
     node main.js help `);
}
