/**
 * Created by max on 15-11-28.
 */

(function () {
    angular.module("upload_news", [])
        .controller("uploadCtrl", ["$log", "$http", function ($log, $http) {
            this.title = "";
            this.image = "";
            this.uptoken = "";
            //this.uptoken_url = "http://localhost:6543/qiniu_uptoken";
            this.uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',    //上传模式,依次退化
                browse_button: 'upload_image',       //上传选择的点选按钮，**必需**
                uptoken_url: 'http://max-meng.imwork.net:6543/qiniu_uptoken?bucket=newsbomb&title='+this.title,            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                //uptoken: this.uptoken, //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                //unique_names: false, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                //save_key: false,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                domain: 'http://7xop7d.com1.z0.glb.clouddn.com',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,
                container: 'upload_image_area',           //上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: '100mb',           //最大文件体积限制
                flash_swf_url: 'bower_components/Plupload/js/Moxie.swf',  //引入flash,相对路径
                max_retries: 3,                   //上传失败最大重试次数
                dragdrop: true,                   //开启可拖曳上传
                drop_element: 'upload_image_area',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',                //分块上传时，每片的体积
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function (up, files) {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                            $log.info("file added");
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前,处理相关的事情
                        $log.info("before upload");
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时,处理相关的事情
                        $log.info("upload progress" + up + file);
                    },
                    'FileUploaded': function (up, file, info) {
                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                        var domain = up.getOption('domain');
                        var res = parseJSON(info);
                        var sourceLink = domain + res.key; //获取上传成功后的文件的Url
                        $log.info("file upload succeed, domain is " + domain + ", res is " + res + ", sourcelink is " + sourceLink)
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时,处理相关的事情
                        $log.error("upload error");
                        $log.error(up);
                        $log.error(err);
                        $log.error(errTip);
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后,处理相关的事情
                        $log.info("upload completed");
                    },
                    'Key': function (up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在 unique_names: false , save_key: false 时才生效
                        $log.info("key config");
                        var key = "";
                        // do something with key here
                        return key
                    }
                }
            });

            //this.submit = function (upload) {
            //    $log.info("title:" + upload["title"] + " image:" + upload["image"]);
            //    $http.get(upload.uptoken_url + "?bucket=" + upload["bucket"] + "&title=" + upload["title"]);
            //};
        }]);
})();