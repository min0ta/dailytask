class Web {
    server = "http://localhost:3000/"

    async post(path, body = {}) {
        const q = await fetch(`${this.server}${path}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: new Headers({'content-type': 'application/json'}),
        })
        return this.#throwError(q.json());
    }
    async get(path) {
        const q = await fetch(`${this.server}${path}`)
        return this.#throwError(q.json());
    }
    async put(path, body = {}) {
        const q = await fetch(`${this.server}${path}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: new Headers({'content-type': 'application/json'}),
        })
        return this.#throwError(q.json());
    }
    async delete(path) {
        const q = await fetch(`${this.server}${path}`, {
            method: "DELETE",
        })
        return this.#throwError(q.json());
    }
    #throwError(q) {
        if (q == null) {
            return q
        }
        if (q.error != null) {
            throw q.error
        }
        return q
    }
    static errors = {
        NotLoggedIn: 'you are not logged in'
    }
}

const web = new Web()

const api = {
    register: async (email, password) => {
        const q = web.post("auth/register", {email, password})
        return q;
    },
    login: async (email, password) => {
        const q = web.post("auth/login", {email, password})
        return q;
    },
    logout: async () => {
        return web.post("auth/logout")
    },
    getTasks: async () => {
        const c = await web.get("tasks")
        if (c.error) {
            if (c.error == Web.errors.NotLoggedIn) {
                document.location.href = '../login/login.html'
            } 
        }
        c.result.map(v => v.expires = new Date(v.expires).toLocaleDateString('en-CA'))
        console.log(c)
        return c.result
    },
    addTask: async (task) => {
        const q = await web.post("tasks", task)
        console.log(q)
        return q.result
    },
    
    updateTask: async (task) => {
        const q = await web.put(`tasks/${task.id}`, task)
        console.log(q)
        return q.result
    },

    deleteTask: async (id) => {
        const q = await web.delete(`tasks/${id}`)
        console.log(q)
        return q.result
    }
};

function pop(s) {
    const html = document.createElement('div')
    html.classList.add('alert', 'alert-append')
    html.innerHTML = 
    `
        <div class='alert-text'>
            <span id='alert-span'>

            </span>
        </div>
    `
    html.querySelector('#alert-span').textContent = s
    document.body.appendChild(html)
    setTimeout(() => {
        html.classList.remove('alert-append')
        html.classList.add('alert-delete')
        html.addEventListener('animationend', html.remove)
    }, 3000)
}