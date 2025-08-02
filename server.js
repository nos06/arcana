const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// 클라이언트 파일을 제공하는 정적 파일 서버 설정
// 현재 스크립트 파일이 있는 디렉토리(__dirname)를 정적 파일 루트로 사용합니다.
app.use(express.static(path.join(__dirname)));

// 사용자 데이터베이스 (간단한 예시)
let users = {};
let verificationCodes = {}; // 이메일 인증 코드를 저장할 객체

// 이메일 전송을 위한 Nodemailer 설정
const transporter = nodemailer.createTransport({
    service: 'gmail', // 사용하는 이메일 서비스 (예: gmail)
    auth: {
        user: '당신의_이메일_주소@gmail.com', // <-- 여기에 Gmail 주소 입력
        pass: '당신의_앱_비밀번호' // <-- 여기에 Gmail 앱 비밀번호 입력
    }
});

// 회원가입 API
app.post('/api/register', async (req, res) => {
    const { id, email, password, grade } = req.body;
    
    if (!id || !email || !password || !grade) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (users[id]) {
        return res.status(400).json({ error: 'User ID already exists.' });
    }

    // 6자리 랜덤 인증 코드 생성
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 인증 코드와 함께 사용자 정보를 임시 저장
    verificationCodes[id] = { 
        code: verificationCode, 
        email: email, 
        password: password, 
        grade: grade,
        createdAt: Date.now() // 인증 코드 만료 시간 처리를 위해 생성 시간 추가
    };

    const mailOptions = {
        from: 'AMB Protocol <당신의_이메일_주소@gmail.com>',
        to: email,
        subject: 'AMB Protocol 이메일 인증 코드',
        html: `<p>회원가입을 위한 인증 코드입니다.</p><h1>${verificationCode}</h1>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification code sent to ${email} for user ${id}`);
        res.status(200).json({ message: 'Verification code sent to your email.' });
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        res.status(500).json({ error: 'Failed to send verification email.' });
    }
});

// 이메일 인증 코드 확인 API
app.post('/api/verify', (req, res) => {
    const { id, code } = req.body;
    const pendingUser = verificationCodes[id];
    
    if (!pendingUser) {
        return res.status(400).json({ error: 'Verification session expired or invalid ID.' });
    }

    // 인증 코드 만료 시간 (예: 10분)
    const expirationTime = 10 * 60 * 1000;
    if (Date.now() - pendingUser.createdAt > expirationTime) {
        delete verificationCodes[id];
        return res.status(400).json({ error: 'Verification code has expired. Please try again.' });
    }

    if (pendingUser.code === code) {
        // 인증 성공 시 사용자 등록
        users[id] = {
            password: pendingUser.password,
            grade: pendingUser.grade,
            email: pendingUser.email,
            entropyDebt: 0,
            isVerified: true
        };
        delete verificationCodes[id]; // 사용한 인증 코드 삭제
        console.log(`User ${id} successfully registered and verified.`);
        return res.status(200).json({ message: 'Verification successful! You can now log in.' });
    }
    
    res.status(400).json({ error: 'Invalid verification code.' });
});

// 로그인 API
app.post('/api/login', (req, res) => {
    const { id, password } = req.body;
    const user = users[id];
    
    if (!id || !password) {
        return res.status(400).json({ error: 'ID and password are required.' });
    }

    if (user && user.password === password && user.isVerified) {
        // 클라이언트에 사용자 정보(등급)를 함께 보냅니다.
        return res.status(200).json({ message: 'Login successful!', user: { id: id, grade: user.grade } });
    }
    
    res.status(401).json({ error: 'Invalid ID, password, or unverified account.' });
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
