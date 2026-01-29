import { Construct } from 'constructs';
import { App, S3Backend, TerraformStack } from 'cdktf';
import { LocalProvider } from '@cdktf/provider-local/lib/provider';
import { NullProvider } from '@cdktf/provider-null/lib/provider';
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { config } from './config';

class FirefoxAndroidHomeRecommendations extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AwsProvider(this, 'aws', {
      region: 'us-east-1',
    });

    new LocalProvider(this, 'local_provider');
    new NullProvider(this, 'null_provider');

    new S3Backend(this, {
      bucket: `mozilla-content-team-${config.environment.toLowerCase()}-terraform-state`,
      dynamodbTable: `mozilla-content-team-${config.environment.toLowerCase()}-terraform-state`,
      key: config.name,
      region: 'us-east-1',
    });
  }
}

const app = new App();
new FirefoxAndroidHomeRecommendations(
  app,
  'firefox-android-home-recommendations',
);
app.synth();
