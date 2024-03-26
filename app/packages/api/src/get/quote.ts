import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { parse } from 'csv-parse';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

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

export const handler = ApiHandler(async (event: APIGatewayProxyEventV2) => {
    // @TODO: send quotes already displayed to not send them back again
    // @TODO: add query params to exclude some quotes id

    if (event.pathParameters?.id && !isNaN(parseInt(event.pathParameters.id))) {
        // if you specify an ID, it won't read the exclude query parameter
        console.log('ID parameter: ', event.pathParameters.id)
        const id = parseInt(event.pathParameters.id)
        if (id < 0 || id >= quotes.length) {
            return { body: JSON.stringify({ error: 'Invalid ID' }), statusCode: 400 }
        }
        return { body: JSON.stringify({ ...quotes[id], id }), statusCode: 200 }
    }

    const exclude: number[] = []
    if (event.queryStringParameters?.exclude) {
        console.log('Exclude parameter: ', event.queryStringParameters.exclude)
        exclude.push(...event.queryStringParameters.exclude.split(',').map(id => parseInt(id)))
        console.log('Excluding: ', exclude)
        // check if you there are still quotes to send
        if (exclude.length >= quotes.length) {
            console.log('No more quotes to send, ignoring exclude query parameter.')
            exclude.length = 0
        }
    }

    // Get an index that in not in exclude
    let id = Math.floor(Math.random() * (quotes.length - exclude.length))
    while (exclude.includes(id)) {
        // if the id is in exclude, there is always an id not in exclude after
        id += 1
    }
    console.log('Index: ', id)

    const quote = { ...quotes[id], id }
    console.log('Quote: ', quote)
    return { body: JSON.stringify(quote), statusCode: 200 };
});