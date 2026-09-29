pipeline {
    agent any

    tools {
        nodejs 'nodejs-24'
    }

    parameters {
            gitParameter(
            name: 'BRANCH_NAME',
            type: 'PT_BRANCH',
            defaultValue: 'refactor/common-cli-executor',
            branchFilter: 'origin/(.*)',
            sortMode: 'ASCENDING_SMART',
            selectedValue: 'DEFAULT',
            quickFilterEnabled: true,
            description: '빌드할 Git 브랜치를 선택하세요.'
        )
    }

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    def selectedBranch =
                        params.BRANCH_NAME.replaceFirst('^origin/', '')

                    echo "Selected branch: ${selectedBranch}"

                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "*/${selectedBranch}"]],
                        userRemoteConfigs: [[
                            url: 'https://github.com/ksj8624-sudo/private-agent-backend.git'
                        ]]
                    ])
                }
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