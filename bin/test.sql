

--新建AK

INSERT INTO "public"."access_key" ("account_login_name", "access_key_id", "access_key_secret", "description", "active", "type") VALUES ('guangqi', '59F6WZYJ6PT4G879D318', 'u610p9q44llvd1c0qluj06yq3d1946kz', '广汽乘用车', '1', '0');



--新建account

INSERT INTO "public"."account" ("name","login_name","description","status") values ('广汽乘用车','guangqi','广汽乘用车','1');



--新建enterprise

insert into "public"."enterprise_setting" ("account_login_name","enterprise_id","enterprise_name","hidden_type","active") values ('guangqi','010Y','广汽乘用车','0','1');

--新建角色

insert into "public"."login_role" ("account_login_name","name","description","type","permission_menu") values ('guangqi','admin','系统管理员','0','{icr:appeal:view,icr:appeal:export,icr:appeal:intercept,icr:appeal:add,icr:interception:view,icr:interception:export,icr:invalid:view,icr:invalid:export,icr:statistics:view,icr:statistics:export,sys:agent:tag:view,sys:agent:tag:add,sys:agent:tag:delete,sys:agent:tag:update,sys:customize_report:view,sys:customize_report:add,sys:customize_report:update,sys:customize_report:delete,sa:report:total:real-time:view,sa:tag:all:view,sa:caseBase:view,sa:caseBase:export,sa:caseBase:download,sys:caseBase:view,sys:caseBase:add,sys:caseBase:delete,sys:caseBase:update,sqc​:word:stopwords:view,sqc​:word:stopwords:add,sqc​:word:stopwords:update,sqc​:word:stopwords:delete,sa:dialogue:view,sa:dialogue:export,sa:dialogue:save,sa:client:analysis:view,sa:dialogue:total:view,sa:dialogue:total:export,sa:dialogue:client:view,sa:dialogue:client:export,sa:dialogue:keyword:view,sa:dialogue:keyword:export,sa:dialogue:qc:view,sa:dialogue:qc:export,sa:dialogue:items:view,sa:dialogue:items:export,ta:ticket:view,ta:ticket:export,ta:ticket:save,reqc:cdr,reqc:dialogue,reqc:ticket,sqc:wordle-stop-words:setting,sa:report:total:real-time:export,ta:ticket:total:export,sys:offline:report:setting:view,sys:offline:report:setting:update,ta:ticket:keyword:export,sys:agent:tag:view,sys:agent:tag:add,sys:agent:tag:delete,sqc:index:view,sqc:index:export,sa:record:view,sa:record:export,sa:record:download,sa:record:save,sa:report:total:view,sa:report:total:export,sa:report:client:view,sa:report:client:export,sa:report:keyword:view,sa:report:keyword:export,sa:report:inspector:view,sa:report:inspector:export,sa:report:item:view,sa:report:item:export,ca:customer:view,ca:customer:export,ca:outbound:area:view,ca:outbound:area:export,ca:outbound:customer:view,ca:outbound:customer:export,ca:outbound:time:view,ca:outbound:time:export,ca:outbound:operator:view,ca:outbound:operator:export,ca:outbound:call:view,ca:outbound:call:export,sqc​:word:keyword:view,sqc​:word:keyword:add,sqc​:word:keyword:import,sqc​:word:keyword:export,sqc​:word:keyword:download,sqc​:word:keyword:update,sqc​:word:keyword:delete,sqc​:word:group:view,sqc​:word:group:add,sqc​:word:group:update,sqc​:word:group:delete,sqc​:tag:view,sqc​:tag:add,sqc​:tag:delete,sqc​:tag:update,sqc​:template:view,sqc​:template:export,sqc​:template:add,sqc​:template:delete,sqc​:template:update,sys:hide:view,sys:hide:update,sys:record:view,sys:record:update,sys:enterprise:view,sys:enterprise:add,sys:enterprise:delete,sys:enterprise:update,sys:enterprise:import,sys:enterprise:export,sys:enterprise:download,sys:enterprise:setting,sys:queue:view,sys:queue:add,sys:queue:delete,sys:queue:update,sys:queue:import,sys:queue:export,sa:tag:all:export,sys:queue:download,sys:client:view,sys:client:add,sys:client:delete,sys:client:update,sys:client:import,sys:client:export,sys:client:download,sys:user:view,sys:user:add,sys:user:delete,sys:user:update,sys:role:view,sys:role:add,sys:role:delete,sys:role:update,sys:separate:view,sys:separate:add,sys:separate:delete,sys:separate:update,sys:alarm:view,sys:alarm:add,sys:alarm:delete,sys:alarm:update,sys:alarm:view,sys:alarm:add,sys:alarm:delete,sys:alarm:update,sys:log:view,sys:log:export,sys:agent:tag:update,sa:tag:agent:view,sa:tag:agent:export,sa:record:agent:confirm,sys:cdr-group:view,sys:cdr-group:add,sys:cdr-group:update,sys:cdr-group:delete,sys:customize_fields:view,sys:customize_fields:add,sys:customize_fields:update,sys:customize_fields:delete,ta:ticket:total:view,ta:ticket:item:view,ta:ticket:item:export,ta:ticket:keyword:view,ta:ticket:inspector:view,ta:ticket:inspector:export,sa:complaint:view,sa:complaint:save,sa:qc_review:view,sa:qc_review:save,sa:record:arbitration:manager,sa:record:task:allocation}');


 update login_role  set permission_menu='{icr:appeal:view,icr:appeal:export,icr:appeal:intercept,icr:appeal:add,icr:interception:view,icr:interception:export,icr:invalid:view,icr:invalid:export,icr:statistics:view,icr:statistics:export,sys:agent:tag:view,sys:agent:tag:add,sys:agent:tag:delete,sys:agent:tag:update,sys:customize_report:view,sys:customize_report:add,sys:customize_report:update,sys:customize_report:delete,sa:report:total:real-time:view,sa:tag:all:view,sa:caseBase:view,sa:caseBase:export,sa:caseBase:download,sys:caseBase:view,sys:caseBase:add,sys:caseBase:delete,sys:caseBase:update,sqc​:word:stopwords:view,sqc​:word:stopwords:add,sqc​:word:stopwords:update,sqc​:word:stopwords:delete,sa:dialogue:view,sa:dialogue:export,sa:dialogue:save,sa:client:analysis:view,sa:dialogue:total:view,sa:dialogue:total:export,sa:dialogue:client:view,sa:dialogue:client:export,sa:dialogue:keyword:view,sa:dialogue:keyword:export,sa:dialogue:qc:view,sa:dialogue:qc:export,sa:dialogue:items:view,sa:dialogue:items:export,ta:ticket:view,ta:ticket:export,ta:ticket:save,reqc:cdr,reqc:dialogue,reqc:ticket,sqc:wordle-stop-words:setting,sa:report:total:real-time:export,ta:ticket:total:export,sys:offline:report:setting:view,sys:offline:report:setting:update,ta:ticket:keyword:export,sys:agent:tag:view,sys:agent:tag:add,sys:agent:tag:delete,sqc:index:view,sqc:index:export,sa:record:view,sa:record:export,sa:record:download,sa:record:save,sa:report:total:view,sa:report:total:export,sa:report:client:view,sa:report:client:export,sa:report:keyword:view,sa:report:keyword:export,sa:report:inspector:view,sa:report:inspector:export,sa:report:item:view,sa:report:item:export,ca:customer:view,ca:customer:export,ca:outbound:area:view,ca:outbound:area:export,ca:outbound:customer:view,ca:outbound:customer:export,ca:outbound:time:view,ca:outbound:time:export,ca:outbound:operator:view,ca:outbound:operator:export,ca:outbound:call:view,ca:outbound:call:export,sqc​:word:keyword:view,sqc​:word:keyword:add,sqc​:word:keyword:import,sqc​:word:keyword:export,sqc​:word:keyword:download,sqc​:word:keyword:update,sqc​:word:keyword:delete,sqc​:word:group:view,sqc​:word:group:add,sqc​:word:group:update,sqc​:word:group:delete,sqc​:tag:view,sqc​:tag:add,sqc​:tag:delete,sqc​:tag:update,sqc​:template:view,sqc​:template:export,sqc​:template:add,sqc​:template:delete,sqc​:template:update,sys:hide:view,sys:hide:update,sys:record:view,sys:record:update,sys:enterprise:view,sys:enterprise:add,sys:enterprise:delete,sys:enterprise:update,sys:enterprise:import,sys:enterprise:export,sys:enterprise:download,sys:enterprise:setting,sys:queue:view,sys:queue:add,sys:queue:delete,sys:queue:update,sys:queue:import,sys:queue:export,sa:tag:all:export,sys:queue:download,sys:client:view,sys:client:add,sys:client:delete,sys:client:update,sys:client:import,sys:client:export,sys:client:download,sys:user:view,sys:user:add,sys:user:delete,sys:user:update,sys:role:view,sys:role:add,sys:role:delete,sys:role:update,sys:separate:view,sys:separate:add,sys:separate:delete,sys:separate:update,sys:alarm:view,sys:alarm:add,sys:alarm:delete,sys:alarm:update,sys:alarm:view,sys:alarm:add,sys:alarm:delete,sys:alarm:update,sys:log:view,sys:log:export,sys:agent:tag:update,sa:tag:agent:view,sa:tag:agent:export,sa:record:agent:confirm,sys:cdr-group:view,sys:cdr-group:add,sys:cdr-group:update,sys:cdr-group:delete,sys:customize_fields:view,sys:customize_fields:add,sys:customize_fields:update,sys:customize_fields:delete,ta:ticket:total:view,ta:ticket:item:view,ta:ticket:item:export,ta:ticket:keyword:view,ta:ticket:inspector:view,ta:ticket:inspector:export,sa:complaint:view,sa:complaint:save,sa:qc_review:view,sa:qc_review:save,sa:record:arbitration:manager,sa:record:task:allocation}'

 where type=0;




--新建用户

insert into "public"."login_user" ("account_login_name","username","password","description","type","permission") values ('guangqi','admin','afdd0b4ad2ec172c586e2150770fbf9e','全国管理员','0','1');



--新建用户企业关联表

insert into "public"."login_user_enterprise" ("account_login_name","login_user_id","enterprise_id") values ('guangqi','1','010Y');



--新建用户角色关联关系

insert into "public"."login_user_role" ("account_login_name","login_user_id","login_role_id") values ('guangqi','1','1');