FROM registry.cn-beijing.aliyuncs.com/rms-production/smartlink-alpine-java:1.0

RUN cd / \
    && mkdir -p /opt/davinci/logs/sys \
    && chmod -R a+w /opt/davinci/logs

ADD ./davinci /opt/davinci

ENV DAVINCI3_HOME /opt/davinci
ENV CLASSPATH $JAVA_HOME/lib/*:$DAVINCI3_HOME/lib/*

WORKDIR /opt/davinci

# ENTRYPOINT ["/bin/sh", "-c", "java  -jar $JAVA_OPTIONS /opt/davinci/lib/davinci-server_3.01-0.3.1.1.jar $JAVA_PARAMS"]
ENTRYPOINT ["/bin/sh", "-c", "/opt/davinci/bin/start-server.sh"]
EXPOSE 8080
