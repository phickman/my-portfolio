import boto3
from botocore.client import Config
from io import BytesIO
import zipfile
import mimetypes

def lambda_handler(event, context):
    s3 = boto3.resource('s3', config=Config(signature_version='s3v4'))

    portfolio_bucket = s3.Bucket('portfolio.suprising.info')
    build_bucket = s3.Bucket('portfoliobuild.suprising.info')

    portfolio_zip = BytesIO()
    build_bucket.download_fileobj('portfoliobuild.zip', portfolio_zip)

    # mimetypes guesses based on the extension, make sure extension is correct
    # latest version from course doesn't use mimetypes
    with zipfile.ZipFile(portfolio_zip) as myzip:
        for nm in myzip.namelist():
            obj = myzip.open(nm)
            portfolio_bucket.upload_fileobj(obj, nm,
                ExtraArgs={'ContentType': mimetypes.guess_type(nm)[0]})
            portfolio_bucket.Object(nm).Acl().put(ACL='public-read')

    print "Job done!"

    return 'Hello from Lambda'
