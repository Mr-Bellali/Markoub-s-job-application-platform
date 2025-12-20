import { s3 } from "../config";
import { PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";

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
}