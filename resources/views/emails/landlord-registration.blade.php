<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Landlord Registration</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #FF4500, #FF6A1F);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .info-box {
            background: white;
            border-left: 4px solid #FF4500;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .label {
            font-weight: bold;
            color: #FF4500;
            display: inline-block;
            width: 100px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏠 New Landlord Registration</h1>
        <p>RentHouse Management System</p>
    </div>
    
    <div class="content">
        <p>A new landlord has submitted a registration request. Here are the details:</p>
        
        <div class="info-box">
            <p><span class="label">Name:</span> {{ $data['name'] }}</p>
            <p><span class="label">Email:</span> {{ $data['email'] }}</p>
            <p><span class="label">Phone:</span> {{ $data['phone'] ?? 'Not provided' }}</p>
            <p><span class="label">Address:</span> {{ $data['address'] }}</p>
            @if(!empty($data['message']))
                <p><span class="label">Message:</span> {{ $data['message'] }}</p>
            @endif
            <p><span class="label">Submitted:</span> {{ now()->format('F d, Y \a\t h:i A') }}</p>
        </div>
        
        <p>
            <strong>Next Steps:</strong><br>
            1. Verify the landlord's information<br>
            2. Create their account in the admin panel<br>
            3. Send them login credentials<br>
            4. Follow up within 24 hours
        </p>
        
        <div class="footer">
            <p>This email was sent from RentHouse Management System.</p>
            <p>Please do not reply to this automated message.</p>
        </div>
    </div>
</body>
</html>