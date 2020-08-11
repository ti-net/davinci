FROM registry.cn-beijing.aliyuncs.com/rms-production/smartlink-alpine-java:1.0

RUN cd / \
    && mkdir -p /opt/davinci \
    && mkdir -p /opt/phantomjs-2.1.1

ADD davinci /opt/davinci
ADD phantomjs-2.1.1  /opt/phantomjs-2.1.1

RUN chmod +x /opt/phantomjs-2.1.1/bin/phantomjs

ENV DAVINCI3_HOME /opt/davinci
ENV PHANTOMJS_HOME /opt/phantomjs-2.1.1
WORKDIR /opt/davinci

ENTRYPOINT ["/bin/sh", "-c", "java  -jar $JAVA_OPTIONS /opt/davinci/lib/davinci-server_3.01-0.3.1-SNAPSHOT.jar $JAVA_PARAMS"]
EXPOSE 8080

