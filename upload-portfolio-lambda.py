import boto3
from botocore.client import Config
from io import BytesIO
import zipfile
import mimetypes

def lambda_handler(event, context):
    sns = boto3.resource('sns')
    topic = sns.Topic('arn:aws:sns:us-east-1:413050676508:deployPortfolioTopic')

    # default bucket & object name (to run locally)
    location = {
        "bucketName": 'portfoliobuild.suprising.info',
        "objectKey": 'portfoliobuild.zip'
    }
    try:
        job = event.get("CodePipeline.job")
        
        print "Job details=" + str(job)
        
        if job:
            for artifact in job["data"]["inputArtifacts"]:
                if artifact["name"] == "BuildArtifact":
                    location = artifact["location"]["s3Location"]
                    
        print "Building portfolio from " + str(location)
                    
        s3 = boto3.resource('s3', config=Config(signature_version='s3v4'))
        
        portfolio_bucket = s3.Bucket('portfolio.suprising.info')
        build_bucket = s3.Bucket(location["bucketName"])
        
        portfolio_zip = BytesIO()
        build_bucket.download_fileobj(location["objectKey"], portfolio_zip)
        
        # mimetypes guesses based on the extension, make sure extension is correct
        with zipfile.ZipFile(portfolio_zip) as myzip:
            for nm in myzip.namelist():
                obj = myzip.open(nm)
                portfolio_bucket.upload_fileobj(obj, nm,
                    ExtraArgs={'ContentType': mimetypes.guess_type(nm)[0]})
                portfolio_bucket.Object(nm).Acl().put(ACL='public-read')
    
        print "Job done!"
        topic.publish(Subject='Portfolio Deployed', Message='Portfolio deployed successfully')
        
        # notify codepipeline of result
        if job:
            codepipeline = boto3.client('codepipeline')
            codepipeline.put_job_success_result(jobId=job["id"])
            
    except:
        topic.publish(Subject='Portfolio Deploy Failed', Message='The Portfolio was not deployed successfully')
        raise
    
    return 'Hello from Lambda'