import { s3 } from "../config";
import { PutObjectCommand, PutObjectCommandOutput, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

export default class MediaServices {
    private maxFileSize: number;
    private allowedMimeTypes: string[];

    constructor() {
        this.maxFileSize = 2 * 1024 * 1024; // 2MB
        this.allowedMimeTypes = ['application/pdf'] // To be more dynamically changeable in the future
    }

    // Getter of the max file size
    public getMaxFileSize(): number {
        return this.maxFileSize;
    }

    // Getter of the allowed file types
    public getAllowedMimeTypes(): string[] {
        return this.allowedMimeTypes;
    }

    // Method to upload the media to bucket
    async uploadFileToBucket(
        file: Buffer,
        filePath: string,
        mimeType: string
    ): Promise<PutObjectCommandOutput> {
        return s3.send(
            new PutObjectCommand({
                Bucket: "resumes",
                Key: filePath,
                Body: file,
                ContentType: mimeType,
            })
        );
    }

    // Method to retrieve file from bucket
    async getFileFromBucket(filePath: string): Promise<Buffer> {
        try {
            const command = new GetObjectCommand({
                Bucket: "resumes",
                Key: filePath,
            });

            const response = await s3.send(command);

            // Convert the stream to buffer
            if (response.Body instanceof Readable) {
                const chunks: Buffer[] = [];
                for await (const chunk of response.Body) {
                    chunks.push(Buffer.from(chunk));
                }
                return Buffer.concat(chunks);
            }

            throw new Error("Invalid response body type");
        } catch (error) {
            console.error("Error retrieving file from bucket: ", error);
            throw error;
        }
    }
}