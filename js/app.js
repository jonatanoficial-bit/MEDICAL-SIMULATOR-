let state = {
score: 0
};

function go(page) {
document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
document.getElementById(page).classList.add("active");
}

function action(type) {
if(type === "exam") {
state.score += 10;
alert("Exame solicitado");
}

```
if(type === "diagnose") {
    state.score += 20;
    alert("Diagnóstico feito");
}
```

}

function finishCase() {
document.getElementById("score").innerText = "Pontuação: " + state.score;
go("result");
}
