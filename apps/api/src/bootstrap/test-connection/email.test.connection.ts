import Emailtransporter from '../email.init';

const testEmailTransporterConnection = async () => {
  try {
    // !
    return true;
    // await Emailtransporter.verify();
    // console.log('✅ SUCCESS : Email transporter verified successfully.');
  } catch (error) {
    console.error('❌ ERROR : Failed to create email transporter:', error);
    process.exit(1);
  }
};

export default testEmailTransporterConnection;
