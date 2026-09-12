import {PDFParse} from "pdf-parse";

const ParsePdf =async(path)=>{
    if(!path){
        console.log("path is Required");
        return;
    }
    const parser =new PDFParse({
        url:path
    });
    const resumeText =await parser.getText();
    return resumeText.text;
}
export default ParsePdf;