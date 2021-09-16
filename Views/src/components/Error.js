

const Error = ({value}) => {
    return ( <>
    <main className="main">
        <div className="error">
            <div className="error__title">
                <h2 className="heading-secondary heading-secondary--error">
                    Something went Wrong

                </h2>
            </div>
            <div className="error__msg">{value}</div>
        </div>
    </main>
     
    </> );
}
 
export default Error;