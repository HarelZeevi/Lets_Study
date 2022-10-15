import '../Styles/NotFound.css';

function NotFound(props) {
    return (
        <div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <h1 className='NFh1'>Page "{props.pathname}" Not Found</h1>
            <p className='NFp'>Please contact our support team if you need help</p>
        </div>
    )
}
export default NotFound;