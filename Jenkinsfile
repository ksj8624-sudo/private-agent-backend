pipeline {
    agent any

    tools {
        nodejs 'nodejs-24'
    }

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Environment') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Syntax Check') {
            steps {
                sh 'find src -name "*.js" -print0 | xargs -0 -n 1 node --check'
            }
        }
    }
}