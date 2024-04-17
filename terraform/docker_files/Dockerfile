# creating images for configured elk stack

FROM docker.elastic.co/logstash/logstash:7.16.3
COPY --chown=logstash:logstash pipeline.conf /usr/share/logstash/pipeline/pipeline.conf

# FROM docker.elastic.co/elasticsearch/elasticsearch:7.16.3
# COPY elasticsearch.yml /usr/share/elasticsearch/config/

# FROM docker.elastic.co/kibana/kibana:7.16.3
# COPY kibana.yml /usr/share/kibana/config/
