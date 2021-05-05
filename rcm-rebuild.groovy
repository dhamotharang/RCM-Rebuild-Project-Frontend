//Pre-requisite
// Setup credential for Github, 
// Cloudbees build and publish plugin, 
// Manage Jenkins -> Configure System -> Publish over ssh plugin, 
// Manage Jenkins -> Configure System -> Slack notifier plugin

job('rcm rebuild groovy') {
    scm {
        git {
            remote {
                // Sets credentials for authentication with the remote repository.
                credentials('6a433da4-d5e8-41bc-af55-83d9960ef829')
           
                // Sets the remote URL.
                url('https://github.com/InternationalRiceResearchInstitute/rcmffr-rebuild.git')
            }

            branch('*/dev')
        }
    }

    triggers{
        cron('H H * * *')
    }

    steps {
        dockerBuildAndPublish {
            repositoryName('irribim/rcmffr-rebuild')
            tag('frontend-${BUILD_TIMESTAMP}')
            registryCredentials('0de4ce6a-361a-4df7-a363-67de79488f7d')

            noCache(true)
            forcePull(true)
            createFingerprints(true)
            skipTagAsLatest(true)
            forceTag(false)
            additionalBuildArgs('--build-arg BUILD_TIMESTAMP="${BUILD_TIMESTAMP}"  --build-arg BUILD_SPRINT="8"')
        }

        shell('docker rmi irribim/rcmffr-rebuild:frontend-${BUILD_TIMESTAMP}')
    }

    publishers {
        
        publishOverSsh {
            server('Dev Server') {
                transferSet {
                    execCommand('docker service update --with-registry-auth --image irribim/rcmffr-rebuild:frontend-${BUILD_TIMESTAMP} rcm_angular')
                }
            }
        }

        slackNotifier {
            tokenCredentialId('4bd121ee-0ec7-4122-8f52-0e7d073eb384')
            baseUrl('https://hooks.slack.com/services/')
            room('#rcm-ci')
            includeCustomMessage(false)
            commitInfoChoice('AUTHORS_AND_TITLES')
            notifySuccess(true)
            notifyAborted(true)
            notifyNotBuilt(true)
            notifyUnstable(true)
            notifyRegression(true)
            notifyEveryFailure(true)
            notifyBackToNormal(true)

        }
        
    }


}
