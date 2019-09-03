var Bat = function(upx, ctx, $el){

    this.upx = upx;
    this.$el = $el;  
    this.ctx = ctx;  
    this.speed = 10;
    
    var that = this;

    if(this.upx == 1){
        window.addEventListener('mousemove', function(e){                    
            var y = e.clientY-(that.height/2);
            that.speed = that.y - y;
            that.y = y;
        }, false);
    }
    
};

Bat.prototype.width = 40;
Bat.prototype.height = 130;
Bat.prototype.ability = 4;

Bat.prototype.draw = function(e){

    this.y = this.y || (this.$el.height/2)-(this.height/2);

    var gutter = 50;
    
    this.x = (this.upx == 1) ? this.width+gutter : (this.$el.width - (this.width*2)-gutter);

    // this.x = (this.upx == 1) ? this.width : this.$el.width - (this.width*2);

    if(this.upx == 2){        
        if(Math.abs(this.y - this.ball.y) < this.ability){
            this.y = this.ball.y;
        } else{
            if(this.y < this.ball.y){
                this.y += this.ability;                        
            } else {
                this.y -= this.ability;
            } 
        }       
    }
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);

};

Bat.prototype.intersects = function(x1, y1, w1, h1, x2, y2, w2, h2){
    if (w2 !== Infinity && w1 !== Infinity) {
        w2 += x2;
        w1 += x1;
        if (isNaN(w1) || isNaN(w2) || x2 > w1 || x1 > w2) return false;
    }
        if (y2 !== Infinity && h1 !== Infinity) {
        h2 += y2;
        h1 += y1;
        if (isNaN(h1) || isNaN(y2) || y2 > h1 || y1 > h2) return false;
    }
    return true;
};

Bat.prototype.hit = function(obj){
    return this.intersects(this.x, this.y, this.width, this.height, obj.x, obj.y, obj.size, obj.size) ? this.speed : false;
};

//////

var Ball = function(ctx, $el, up1, up2, img){

    this.up1 = up1;
    this.up2 = up2;
    this.img = img;

    this.$el = $el;    

    this.Xspeed = 5;
    this.Yspeed = -5;

    this.x = window.innerWidth/2;
    this.y = window.innerHeight/2;

    this.ctx = ctx;    

};

Ball.prototype.size = 70;

Ball.prototype.reverse = function(axis){
    this[axis] = this[axis]-(this[axis]*2);
};

Ball.prototype.score = function(upx){
    var $upx = $(upx), 
        score = parseFloat($upx.html());
    $upx.html(++score);
};

Ball.prototype.bounds = function(){      
    if(this.x <= 0 || this.x >= this.$el.width-(this.size)) this.reverse('Xspeed');        
    if(this.y <= 0 || this.y >= this.$el.height-(this.size)) this.reverse('Yspeed');                        

    if(this.x >= this.$el.width-(this.size)) this.score('#js-up1');
    if(this.x <= 0) this.score('#js-up2');

};

Ball.prototype.adjust = function(bat){
    return this.x < bat.x+(bat.width/2) ? bat.x-(this.size+1) : bat.x+bat.width+1;                         
};

Ball.prototype.draw = function(){  

    this.bounds();

    var up1 = this.up1.hit(this), 
        up2 = this.up2.hit(this);

    if(up1 || up2){
        this.reverse('Xspeed');
        this.Yspeed = up1 || up2;
    }

    if(up1){
        this.x = this.adjust(this.up1);
    }

    if(up2){
        this.x = this.adjust(this.up2);
    }

    // this.ctx.fillStyle = "#FF0749";
    // this.ctx.fillRect(this.x, this.y, this.size, this.size);
    this.ctx.drawImage(this.img, this.x, this.y);

    this.x += this.Xspeed;
    this.y += this.Yspeed;

};

///////////

var pong = new Vue({            
    el: '#js-pong',                
    data: {},
    mounted: function(){ 
        
        this.canvas = document.getElementById('js-pong-canvas');

        this.ctx = this.canvas.getContext("2d");  

        this.up1 = new Bat(1, this.ctx, this.canvas);
        this.up2 = new Bat(2, this.ctx, this.canvas);  

        this.heart = new Image();

        var that = this;

        //drawing of the test image - img1
        this.heart.onload = function () {
            
            that.ball = new Ball(that.ctx, that.canvas, that.up1, that.up2, that.heart);        
            that.up2.ball = that.ball;
            that.draw();

        };

        this.heart.src = "/assets/img/heart.png";

        // this.draw();

    },
    methods: {
        resize: function(){            
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
        },
        draw: function(){

            this.resize();  
            
            this.up1.draw();
            this.up2.draw();
            this.ball.draw();          
            
            this.tick();

        },
        tick: function(){            
            var that = this;
            setTimeout(function(){
                that.draw();                
            }, 10);
        }
    }
});
