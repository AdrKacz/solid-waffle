import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { parse } from 'csv-parse';

interface Quote {
    quote: string
    author: string
}

const s3 = new S3Client()
const command = new GetObjectCommand({
    Bucket: Bucket.bucket.bucketName,
    Key: 'quotes/quotes.csv',
})
const response = await s3.send(command)
console.log('Response from S3 (status code): ', response.$metadata.httpStatusCode)

const parser = (response.Body! as NodeJS.ReadableStream).pipe(parse({ delimiter: '|', columns: true }))
const quotes: Quote[] = []
for await (const record of parser) {
    quotes.push({ quote: record['Quote'], author: record['Author'] })
}
console.log('Quotes: ', quotes)

export const handler = ApiHandler(async (event: any) => {
    // @TODO: send quotes already displayed to not send them back again
    // @TODO: add query params to exclude some quotes id

    const quote = quotes[Math.floor(Math.random() * quotes.length)]
    console.log('Quote: ', quote)
    return { body: JSON.stringify(quote), statusCode: 200 };
});