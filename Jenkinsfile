pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18' 
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/vikashkr1101/myrepo.git', credentialsId: 'my-gitaccount-crendentials'
            }
        }
        stage('Install Dependencies') {
            steps {
                bat 'npm install' 
            }
        }
        stage('Build') {
            steps {
                bat 'npm run build' 
            }
        }
        stage('Test') {
            steps {
                bat 'npm run test:unit' 
            }
        }

        stage('SonarQube Analysis') {
            steps {
               withSonarQubeEnv(credentialsId: 'sonarqube-token', installationName: 'MySonarQubeServer') {
                    bat '''
                        sonar-scanner.bat ^
                            -Dsonar.projectKey=mytodoapp ^
                            -Dsonar.sources=. ^
                            -Dsonar.host.url=http://localhost:9000 ^
                            -Dsonar.login=sqp_bc7057391a211e76cde5b9cede30b35a732d76a8
                    '''
                }
            }
        }
    }
}
