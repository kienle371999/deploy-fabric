function a() {
    for (var i = 0; i < 5; i++) {
        console.log('--------', i)
        if(i === 1) {
            return false
        }
    }
}

a()