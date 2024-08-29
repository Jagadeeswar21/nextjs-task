import {S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3"
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const s3Client = new S3Client({
    credentials:{
    accessKeyId: process.env.BUCKET_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY as string,
    },
    region:process.env.AWS_REGION,
  });


  export async function uploadFileToS3(file:any,fileName:any){
    const fileBuffer=file;
    const params={
        Bucket:process.env.BUCKET_NAME,
        Key:`Books/${fileName}`,
        Body:fileBuffer,
        ContentType:"image/jpg"
    }
    const command= new PutObjectCommand(params)
    await s3Client.send(command)
    return fileName
  }


  export async function POST(request:any){
    try{
        await connectMongoDB()
        const formData=await request.formData()
        const file=formData.get("file")
        if(!file){
            return NextResponse.json({error:"File is required"},{status:400})
        }
        const buffer=Buffer.from(await file.arrayBuffer())
        
        const fileName=await uploadFileToS3(buffer,file.name)
        return NextResponse.json({success:true, fileName})
    }catch(error){
        return NextResponse.json({error:"Error uploading file"})
    }
  }

  export async function getS3FileUrl(fileName: string): Promise<string> {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `Books/${fileName}`,
    };
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); 
    return url;
}

export async function GET(request:any) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const fileName = searchParams.get("fileName");

        if (!fileName) {
            return NextResponse.json({ error: "fileName is required" }, { status: 400 });
        }
        const url = await getS3FileUrl(fileName);
        return NextResponse.json({ success: true, url });
    } catch (error) {
        console.error("Error getting signed URL:", error);
        return NextResponse.json({ error: "Error getting signed URL" }, { status: 500 });
    }
}