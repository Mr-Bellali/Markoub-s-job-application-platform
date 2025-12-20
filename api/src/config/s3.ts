import { S3Client } from "@aws-sdk/client-s3";
import importENV from "./importENV";

const s3 = new S3Client({
    region: importENV('S3_REGION'),
    endpoint: importENV('S3_ENDPOINT'),
    credentials: {
        accessKeyId: importENV('S3_ACCESS_KEY_ID'),
        secretAccessKey: importENV('S3_SECRET_ACCESS_KEY')
    },
    forcePathStyle: true
});

export default s3;