# Use phusion/passenger-full as base image. To make your builds reproducible, make
# sure you lock down to a specific version, not to `latest`!
# See https://github.com/phusion/passenger-docker/blob/master/Changelog.md for
# a list of version numbers.

FROM phusion/passenger-ruby22:0.9.15

# Or, instead of the 'full' variant, use one of these:
#FROM phusion/passenger-full:<VERSION>
#FROM phusion/passenger-ruby19:<VERSION>
#FROM phusion/passenger-ruby20:<VERSION>
#FROM phusion/passenger-ruby21:<VERSION>
#FROM phusion/passenger-jruby17:<VERSION>
#FROM phusion/passenger-nodejs:<VERSION>
#FROM phusion/passenger-customizable:<VERSION>

# Set correct environment variables.
ENV HOME /root

# Use baseimage-docker's init process.
CMD ["/sbin/my_init"]

# If you're using the 'customizable' variant, you need to explicitly opt-in
# for features. Uncomment the features you want:
#
#   Build system and git.
#RUN /pd_build/utilities.sh
#   Ruby support.
#RUN /pd_build/ruby1.9.sh
#RUN /pd_build/ruby2.0.sh
#RUN /pd_build/ruby2.1.sh
#RUN /pd_build/ruby2.2.sh



#   Python support.
#RUN /pd_build/python.sh
#   Node.js and Meteor support.
#RUN /pd_build/nodejs.sh

# ...put your own build instructions here...
# Start Nginx / Passenger
RUN rm -f /etc/service/nginx/down

# Remove the default site
RUN rm /etc/nginx/sites-enabled/default

# Add the nginx info
ADD conf/nginx.conf /etc/nginx/sites-enabled/webapp.conf

RUN gem install bundler


# Enable SSH
RUN rm -f /etc/service/sshd/down

# Regenerate SSH host keys. Passenger-docker does not contain any, so you
# have to do that yourself. You may also comment out this instruction; the
# init system will auto-generate one during boot.
RUN /etc/my_init.d/00_regen_ssh_host_keys.sh

## Install key to allow SSH via EC2 key
ADD server_key.pub /tmp/server_key.pub
RUN cat /tmp/server_key.pub >> /root/.ssh/authorized_keys && rm -f /tmp/server_key.pub

## Copy over app folder
RUN mkdir /home/app/hello
WORKDIR /home/app
ADD hello/Gemfile ./
RUN bundle install

# Sample docker file, mysql is the example login.
RUN usermod -u 1000 app

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
