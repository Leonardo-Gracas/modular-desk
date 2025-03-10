import React from 'react'

const NumberExample = ({ obj, index, handleRemoveField }) => {
    return (
        <div className={"px-2 col-md-" + (obj.colspan * 3)}>
            <div key={index} className="d-flex align-items-center justify-content-between field-item bg-beige text-brown border-brown rounded-pill">
                <div className="ps-3">
                    {obj.title}: <span className="text-muted-brown">00</span>
                </div>
                {obj.deletable === false ? "" : 
                    <button
                        className="btn btn-close-brown"
                        onClick={() => handleRemoveField(index)}
                    >
                        ✕
                    </button>}
            </div>
        </div>
    )
}

export default NumberExample