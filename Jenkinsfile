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
        stage('Health Check') {
            steps {
                sh '''
                    PORT=3100 npm start > server.log 2>&1 &
                    SERVER_PID=$!

                    trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

                    ATTEMPT=1
                    while [ "$ATTEMPT" -le 15 ]; do
                        if curl --fail --silent --show-error \
                            http://127.0.0.1:3100/health
                        then
                            echo
                            echo "Health check succeeded."
                            exit 0
                        fi

                        sleep 1
                        ATTEMPT=$((ATTEMPT + 1))
                    done

                    echo "Health check failed."
                    echo "----- server.log -----"
                    cat server.log
                    exit 1
                '''
            }
        }

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