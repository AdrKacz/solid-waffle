import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { parse } from 'csv-parse';

interface Quote {
    quote: string
    author: string,
    sourceLink: string,
    sourceAlt: string,
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
    quotes.push({
        quote: record['Quote'],
        sourceLink: record['Source Link'],
        sourceAlt: record['Source Alt'],
        author: record['Author']
    })
}
console.log('Quotes: ', quotes)

export const handler = ApiHandler(async (event: any) => {
    // @TODO: send quotes already displayed to not send them back again
    // @TODO: add query params to exclude some quotes id

    const id = parseInt(event.pathParameters?.id)
    console.log('(Optional) ID: ', id)
    const index = id ? id : Math.floor(Math.random() * quotes.length)
    console.log('Index: ', index)

    const quote = { ...quotes[index], id: index }
    console.log('Quote: ', quote)
    return { body: JSON.stringify(quote), statusCode: 200 };
});