FROM registry.cn-beijing.aliyuncs.com/rms-production/smartlink-alpine-java:1.0

RUN cd / \
    && mkdir -p /opt/davinci

ADD ./davinci /opt/davinci

ENV DAVINCI3_HOME /opt/davinci

WORKDIR /opt/davinci

# ENTRYPOINT ["/bin/sh", "-c", "java  -jar $JAVA_OPTIONS /opt/davinci/lib/davinci-server_3.01-0.3.1-SNAPSHOT.jar $JAVA_PARAMS"]
ENTRYPOINT ["/bin/sh", "-c", "/opt/davinci/bin/start-server.sh"]
EXPOSE 8080
EXPOSE 9090

