
//人
function person(canvas,cobj,runs,jumps){
    this.canvas=canvas;
    this.cobj=cobj;
    this.runs=runs;
    this.jumps=jumps;

    this.x=0;
    this.y=380;
    this.width=83;
    this.height=110;
    this.speedx=5;
    this.speedy=5;

    this.status="runs";
    this.state=0;
    this.zhongli=0.2;
    this.num=0;

    this.life=3;
}
person.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.status][this.state],0,0,827,1181,0,0,this.width,this.height);
        this.cobj.restore();
    }
}

//障碍物
function hinder(canvas,cobj,hinderImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.x=canvas.width-20;
    this.y=430;
    this.speedx=6;
    this.state=0;
    this.width=70;
    this.height=70;
}
hinder.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinderImg[this.state],0,0,220,220,0,0,this.width,this.height);
        this.cobj.restore();
    }
}
//出血
function blood(cobj){
    this.cobj=cobj;
    this.x = 300;
    this.y = 200;
    this.r = 1+3*Math.random();
    this.color = "rgb(255,0,0)";
    this.speedy = Math.random()*8-4;
    this.speedx = Math.random()*8-4;
    this.zhongli = 0.3;
    this.speedr = 0.1;
}
blood.prototype = {
    draw:function(){
        var cobj=this.cobj;
        cobj.save();
        cobj.translate(this.x,this.y);
        cobj.beginPath();
        cobj.fillStyle = this.color;
        cobj.arc(0,0,this.r,0,2*Math.PI);
        cobj.fill();
        cobj.restore();
    },
    update:function(){
        this.x+=this.speedx;
        this.speedy+=this.zhongli;
        this.y+=this.speedy;
        this.r-=this.speedr;
    }
}
function xue(cobj,x,y){
    var arr = [];
    for(var i = 0;i<30;i++)
    {
        var obj = new blood(cobj);
        obj.x = x;
        obj.y = y;
        arr.push(obj);
    }
    var t = setInterval(function(){
        for(var i = 0;i<arr.length;i++)
        {
            arr[i].draw();
            arr[i].update();

            if(arr[i].r<0){
                arr.splice(i,1);
            }
        }
        if(arr.length==0){
            clearInterval(t);
        }
    })
}
//子弹
function bullet(canvas,cobj,bulletImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.bulletImg=bulletImg;
    this.x=0;
    this.y=0;
    this.width=50;
    this.height=30;
    this.speedx=10;
    this.jia=3;
}
bullet.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.bulletImg,0,0,200,200,0,0,this.width,this.height);
        this.cobj.restore();
    }
}
//游戏的主类
function game(canvas,cobj,runs,jumps,hinderImg,bulletImg,srun,sjump,shit,sdie,szidan,lifes,grades){
    this.canvas=canvas;
    this.cobj=cobj;
    this.runs=runs;
    this.jumps=jumps;
    this.hinderImg=hinderImg;
    this.bulletImg=bulletImg;
    this.srun=srun;
    this.sjump=sjump;
    this.shit=shit;
    this.sdie=sdie;
    this.szidan=szidan;
    this.lifes=lifes;
    this.grades=grades;
    this.width=this.canvas.width;
    this.height=this.canvas.height;
    this.name="";
    this.person=new person(canvas,cobj,runs,jumps);
    this.score=0;  /*积分*/
    this.hinderArr=[];
    this.isfire=false;
    this.isrun=false;
    this.bullet=new bullet(canvas,cobj,bulletImg);
    //move
    this.ts={};
    this.num=0;
    this.num1=0;
    this.top=0;
    this.num2=0;
    this.rand=(Math.ceil((2+Math.random()*3)))*1000;
    //move2
    this.flag=true;
    this.inita=0;
    this.speeda=5;
    this.r=80;
    this.y1=this.person.y;
}
game.prototype={
    play:function(start,mask){
        this.name=prompt("请输入姓名","zhangsan");
        start.css("animation","start1 2s ease forwards");
        mask.css("animation","mask1 2s ease forwards");
        this.run();
        this.key();
        this.mouse();
    },
    run:function () {
        var that=this;
        that.srun.play();
        that.ts.t1=setInterval(function(){
            that.move();
        },50);
    },
    move:function() {
        var that = this;
        that.num++;
        that.num1+=7;
        that.cobj.clearRect(0, 0, that.width, that.height);
        if (that.person.status == "runs") {
            that.person.state = that.num % 8;
        } else{
            that.person.state = 0;
        }
        /*让人物的X发生变化*/
        that.person.x += that.person.speedx;
        if (that.person.x > that.width / 3) {
            that.person.x = that.width / 3;
            that.person.speedx = 0;
        }
        that.person.draw();

        //操作背景
        that.canvas.style.backgroundPositionX = -that.num1 + "px";
        //操作障碍物
        if (that.num2 % that.rand == 0) {
            that.num2 = 0;
            var obj = new hinder(that.canvas, that.cobj, that.hinderImg);
            obj.state = Math.floor(Math.random() * that.hinderImg.length);
            that.hinderArr.push(obj);
        }
        if (that.hinderArr.length > 5) {
            that.hinderArr.shift();
        }
        for (var i = 0; i < that.hinderArr.length; i++) {
            that.hinderArr[i].x -= that.hinderArr[i].speedx;
            that.hinderArr[i].draw();
            if (hitPix(that.canvas, that.cobj, that.person, that.hinderArr[i])) {
                if (!that.hinderArr[i].flag) {
                    that.shit.play();
                    xue(that.cobj, that.person.x + that.person.width / 2, that.person.y + that.person.height / 2);
                    that.person.life--;
                    that.lifes.innerHTML = that.person.life;
                    if (that.person.life < 0) {
                        that.sdie.play();
                        that.srun.pause();
                        // 存储
                        var messages = localStorage.messages ? JSON.parse(localStorage.messages) : [];
                        var temp = {name: that.name, score: that.score};
                        messages.push(temp);
                        // 排序
                        if (messages.length > 0) {
                            messages.sort(function (a, b) {
                                return a.score < b.score;
                            });
                            if (messages.length == 3) {
                                if (temp.score > messages[messages.length - 1].score) {
                                    messages[messages.length - 1] = temp;
                                }
                            } else if (messages.length < 3) {
                                messages.push(temp);
                            }
                        } else {
                            messages.push(temp);
                        }

                        localStorage.messages = JSON.stringify(messages);
                        messages.push(temp);
                        that.over();
                        // location.reload();
                        console.log(messages);
                    }
                    that.hinderArr[i].flag = true;
                }
            }else if (that.person.x > that.hinderArr[i].x + that.hinderArr[i].width) {
                if (!that.hinderArr[i].flag && !that.hinderArr[i].flag1) {
                    that.score++;
                    that.grades.innerHTML = that.score;
                    that.hinderArr[i].flag1 = true;
                }
            }

            //操作子弹
            if (that.isfire) {
                if (hitPix(that.canvas, that.cobj, that.bullet, that.hinderArr[i])) {
                    that.hinderArr.splice(i, 1);
                    that.cobj.clearRect(0, 0, that.w, that.h);
                    that.grades.innerHTML = that.score;
                    that.szidan.play();
                }
            }
        }
        if(that.isfire){
            if(that.bullet.x>600){
                that.isfire=false;
            }
            that.bullet.x+=that.bullet.speedx;
            that.bulletspeedx+=that.bullet.jia;
            that.bullet.draw();
        }
        that.num2+=50;
    },
    key:function(){
        var that=this;
        document.onkeydown=function(e){
            if(e.keyCode==38) {  //向上暂停
                if(!that.isrun){
                    for(var i in that.ts){
                        clearInterval(that.ts[i]);
                    }
                    that.srun.pause();
                    that.isrun=true;
                }else if(that.isrun){
                    that.ts.t1=setInterval(function(){
                        that.move();
                    },50);
                    if(!that.flag){
                        clearInterval(that.ts.t2);
                        that.ts.t2=setInterval(function(){
                            that.move2();
                        },50);
                    }
                    that.srun.play();
                    that.isrun=false;
                }
            }else if(e.keyCode==32){
                if(!that.flag){
                    return;
                }
                that.flag=false;
                that.sjump.play();
                that.srun.pause();
                that.person.status="jumps";
                that.ts.t2=setInterval(function(){
                    that.move2();
                },50)
            }
        }
    },
    move2:function(){
        var that=this;
        that.inita+=that.speeda;
        var top1=Math.sin(that.inita*Math.PI/180)*that.r;
        if(that.inita>=180){
            clearInterval(that.ts.t2);
            that.srun.play();
            that.person.y=that.y1;
            that.person.status="runs";
            that.flag=true;
            that.inita=0;
        }else{
            that.person.y=that.y1-top1;
        }
    },
    mouse:function(){
        var that=this;
        document.querySelector(".mask").onclick=function(){
            if(that.isfire){
                return false;
            }
            that.bullet.x=that.person.x+that.person.width/2;
            that.bullet.y=that.person.y+that.person.height/2;
            that.bullet.speedx=5;
            that.isfire=true;
        }
    },
    over:function(){
        for(var i in this.ts){
            clearInterval(this.ts[i]);  //关闭所有的计时器
        }
        var over=document.querySelector(".over");
        over.style.animation="start 2s ease forwards";
        document.querySelector(".mask").animation="animation: mask 2s ease forwards;";
        this.srun.pause();
        //记录分数
        var scoreEle=document.querySelector(".scoreEle");
        scoreEle.innerHTML=this.score;
        var lis=document.querySelector(".over ul");
        var messages=localStorage.messages?JSON.parse(localStorage.messages):[];
        var str="";
        for (var i = 0; i < messages.length; i++) {
            str+="<li>"+messages[i].name+"："+messages[i].score;
        }
        lis.innerHTML=str;
        this.again();
    },
    again:function(){
        var that=this;
        var btn1=document.querySelector(".again");
        btn1.onclick=function(){
            var over=document.querySelector(".over");
            over.style.animation="start1 2s ease forwards";
            that.person.x=0;
            that.person.y=300;
            that.score=0;
            that.person.life=3;
            that.hinderArr=[];
            that.inita=0;
            that.y1=that.person.y;
            that.grades.innerHTML=that.score;
            that.run();
            btn1.onclick=null;
        }
    },

}