    Dashboard:
        Type: AWS::CloudWatch::Dashboard
        Properties:
            DashboardName: "Secrets-Rotation-Service-List-All-Secrets-Dashboard"
            DashboardBody: |
                {
                    "widgets": [
                        {
                            "type": "metric",
                            "width": 12,
                            "height": 6,
                            "properties": {
                                "metrics": [
                                    [
                                        "AWS/Lambda",
                                        "Invocations",
                                        "FunctionName",
                                        "my-function",
                                        {
                                            "stat": "Sum",
                                            "label": "List-All"
                                        }
                                    ],
                                    [
                                        {
                                            "expression": "SUM(METRICS())",
                                            "label": "Total Invocations"
                                        }
                                    ]
                                ],
                                "region": "us-east-1",
                                "title": "Invocations",
                                "view": "timeSeries",
                                "stacked": false
                            }
                        }
                    ]
                }