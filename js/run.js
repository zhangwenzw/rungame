window.onload=function(){
    var clientW=document.documentElement.clientWidth;
    var clientH=document.documentElement.clientHeight;
    var canvas=document.querySelector("canvas");
    canvas.width=clientW;
    canvas.height=clientH;
    var cobj=canvas.getContext("2d");

    var runs=document.querySelectorAll(".run");
    var jumps=document.querySelectorAll(".jump");
    var hinderImg=document.querySelectorAll(".hinder");
    var bulletImg=document.querySelector(".bullet");
    var srun=document.querySelector(".srun");
    var sjump=document.querySelector(".sjump");
    var shit=document.querySelector(".shit");
    var sdie=document.querySelector(".sdie");
    var szidan=document.querySelector(".szidan");
    var lifes=document.querySelector(".life>span");
    var grades=document.querySelector(".grade>span");

    var gameObj=new game(canvas,cobj,runs,jumps,hinderImg,bulletImg,srun,sjump,shit,sdie,szidan,lifes,grades);

    //开始
    var start=$(".start");
    var mask=$(".mask");
    var startbtn=$(".btn");
    startbtn.one("click",function(){
        gameObj.play(start,mask);
    });

}
