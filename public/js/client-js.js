console.log('Client js loaded')

let button1 = document.querySelector("#sortBy")

if (button1) {
    button1.addEventListener("change", (e) => {
      fetch("/trades?sort=" + e.target.value);
    });
}

let show = false

let button = document.querySelector("#show-profile");

if (button) {
    button.addEventListener("click", (e) => {
        show = !show
        if (show) {
            document.querySelector("#choose-profile").innerHTML = "";
        } else {
            document.querySelector("#choose-profile").innerHTML = `
            <form action="/profile" method="POST" enctype="multipart/form-data" accept=".jpg"> 
                    <div class="form-group">
                        <div class="form-group">
                            <label>
                                <input type="file" name="uploaded_file" class="form-control-file">
                            </label>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-default">Save</button>
                        </div>
                    </div>
                </form>
                <div class="form-group">
                    <form action="/profile/delete?_method=DELETE" method="POST" class="delete-button">
                        <button class="btn btn-large btn-danger">Delete</button>
                    </form>
                </div>
                `;
        }
    });
}

// RESTRICT DATE USER SEES TO BE A MAXIMUM OF TODAY NOT IN THE FUTURE
let date = document.querySelector("#selectTradeDate");

if (date) {
    date.max = new Date().toISOString().split("T")[0];
}